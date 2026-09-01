import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export class CustomerService {
  async getAllCustomers(params: { page: number; limit: number; search?: string; sortBy: string }) {
    const { page, limit, search, sortBy } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'name') orderBy.name = 'asc';
    else if (sortBy === 'createdAt') orderBy.createdAt = 'desc';
    else orderBy.createdAt = 'desc';

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: { select: { bookings: true } },
          vehicles: { take: 3 }
        }
      }),
      prisma.customer.count({ where })
    ]);

    // Calculate total spent for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const stats = await prisma.booking.aggregate({
          where: { customerId: c.id, status: 'completed' },
          _sum: { amount: true }
        });
        return {
          ...c,
          totalBookings: c._count.bookings,
          totalSpent: stats._sum.amount || 0,
          _count: undefined
        };
      })
    );

    return {
      customers: customersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            serviceCategory: { select: { name: true } },
            mechanic: { select: { name: true } }
          }
        }
      }
    });

    if (!customer) throw new ApiError(404, 'CUSTOMER_NOT_FOUND', `Customer with ID '${id}' not found`);

    const stats = await prisma.booking.aggregate({
      where: { customerId: id, status: 'completed' },
      _sum: { amount: true },
      _count: { id: true }
    });

    return {
      ...customer,
      stats: {
        totalBookings: stats._count.id,
        totalSpent: stats._sum.amount || 0,
        avgBookingValue: stats._count.id ? (stats._sum.amount || 0) / stats._count.id : 0
      }
    };
  }
}