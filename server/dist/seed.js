"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const client_1 = require("@prisma/client");
const SERVICE_CATEGORIES = [
    { name: 'Oil Change', description: 'Engine oil and filter replacement', basePrice: 75, avgDuration: 45 },
    { name: 'Brake Repair', description: 'Brake pad and rotor service', basePrice: 250, avgDuration: 90 },
    { name: 'Tire Service', description: 'Tire rotation, alignment, or replacement', basePrice: 120, avgDuration: 60 },
    { name: 'Battery Replacement', description: 'Car battery testing and replacement', basePrice: 180, avgDuration: 30 },
    { name: 'AC Service', description: 'Air conditioning recharge and repair', basePrice: 200, avgDuration: 75 },
    { name: 'Engine Diagnostics', description: 'Check engine light and diagnostics', basePrice: 100, avgDuration: 60 },
    { name: 'Transmission Repair', description: 'Transmission fluid and repairs', basePrice: 400, avgDuration: 180 },
    { name: 'General Maintenance', description: 'Multi-point inspection and maintenance', basePrice: 150, avgDuration: 90 }
];
const MECHANIC_NAMES = [
    'Mike Chen', 'Sarah Johnson', 'David Park', 'Emma Rodriguez', 'James Wilson',
    'Lisa Thompson', 'Robert Kim', 'Amanda Davis', 'Chris Brown', 'Jessica Lee',
    'Daniel Martinez', 'Rachel Green', 'Kevin White', 'Maria Garcia', 'Ryan Taylor',
    'Nicole Adams', 'Brandon Scott', 'Stephanie Lewis', 'Jason Hall', 'Michelle Clark',
    'Andrew Wright', 'Laura King', 'Joshua Baker', 'Melissa Nelson', 'Tyler Carter'
];
const CUSTOMER_FIRST_NAMES = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
const CUSTOMER_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const CAR_MAKES = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Hyundai', 'Kia', 'Nissan'];
const CAR_MODELS = ['Camry', 'Civic', 'F-150', '3 Series', 'C-Class', 'A4', 'Model 3', 'Elantra', 'Sorento', 'Altima'];
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function generateLicensePlate() {
    const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const numbers = Math.floor(Math.random() * 9000 + 1000);
    return `${letters}-${numbers}`;
}
async function seed() {
    console.log('🌱 Starting seed...');
    // Clean up
    await database_1.prisma.bookingStatusHistory.deleteMany();
    await database_1.prisma.mechanicStatusHistory.deleteMany();
    await database_1.prisma.booking.deleteMany();
    await database_1.prisma.vehicle.deleteMany();
    await database_1.prisma.mechanic.deleteMany();
    await database_1.prisma.customer.deleteMany();
    await database_1.prisma.serviceCategory.deleteMany();
    // Create service categories
    const categories = await Promise.all(SERVICE_CATEGORIES.map(cat => database_1.prisma.serviceCategory.create({ data: cat })));
    console.log(`✅ Created ${categories.length} service categories`);
    // Create mechanics
    const mechanics = await Promise.all(MECHANIC_NAMES.map((name, i) => database_1.prisma.mechanic.create({
        data: {
            name,
            email: `mechanic${i + 1}@instantmechanic.com`,
            phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            status: randomItem([client_1.MechanicStatus.available, client_1.MechanicStatus.busy, client_1.MechanicStatus.offline]),
            specialization: [randomItem(categories).name, randomItem(categories).name],
            rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
            totalJobsCompleted: Math.floor(Math.random() * 500)
        }
    })));
    console.log(`✅ Created ${mechanics.length} mechanics`);
    // Create customers with vehicles
    const customers = [];
    for (let i = 0; i < 60; i++) {
        const firstName = randomItem(CUSTOMER_FIRST_NAMES);
        const lastName = randomItem(CUSTOMER_LAST_NAMES);
        const customer = await database_1.prisma.customer.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
                phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
                vehicles: {
                    create: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => ({
                        make: randomItem(CAR_MAKES),
                        model: randomItem(CAR_MODELS),
                        year: 2018 + Math.floor(Math.random() * 7),
                        licensePlate: generateLicensePlate(),
                        color: randomItem(['Silver', 'Black', 'White', 'Blue', 'Red', 'Gray'])
                    }))
                }
            },
            include: { vehicles: true }
        });
        customers.push(customer);
    }
    console.log(`✅ Created ${customers.length} customers`);
    // Create 600+ bookings
    const statuses = ['pending', 'assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled'];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    for (let i = 0; i < 600; i++) {
        const customer = randomItem(customers);
        const vehicle = randomItem(customer.vehicles);
        const category = randomItem(categories);
        const mechanic = Math.random() > 0.1 ? randomItem(mechanics) : null;
        const status = randomItem(statuses);
        const createdAt = randomDate(thirtyDaysAgo, now);
        const scheduledDate = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
        const amount = category.basePrice + Math.floor(Math.random() * 100 - 50);
        const booking = await database_1.prisma.booking.create({
            data: {
                bookingNumber: `BK-${5000 + i}`,
                status,
                amount: Math.max(50, amount),
                scheduledDate,
                scheduledTime: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00`,
                completedAt: status === 'completed' ? new Date(scheduledDate.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null,
                notes: Math.random() > 0.7 ? 'Customer requested premium service' : null,
                address: `${Math.floor(Math.random() * 9000) + 1000} ${randomItem(['Main St', 'Oak Ave', 'Park Rd', 'Elm St'])}, Austin, TX`,
                lat: 30.2672 + (Math.random() - 0.5) * 0.1,
                lng: -97.7431 + (Math.random() - 0.5) * 0.1,
                createdAt,
                customerId: customer.id,
                vehicleId: vehicle.id,
                mechanicId: mechanic?.id,
                serviceCategoryId: category.id,
                statusHistory: {
                    create: [{ status: 'pending', createdAt }]
                }
            }
        });
        // Add more status history for completed bookings
        if (status === 'completed' && mechanic) {
            await database_1.prisma.bookingStatusHistory.createMany({
                data: [
                    { bookingId: booking.id, status: 'assigned', createdAt: new Date(createdAt.getTime() + 3600000) },
                    { bookingId: booking.id, status: 'on_the_way', createdAt: new Date(createdAt.getTime() + 7200000) },
                    { bookingId: booking.id, status: 'in_progress', createdAt: new Date(createdAt.getTime() + 10800000) },
                    { bookingId: booking.id, status: 'completed', createdAt: booking.completedAt }
                ]
            });
        }
    }
    console.log(`✅ Created 600 bookings`);
    console.log('🎉 Seed completed!');
}
seed()
    .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await database_1.prisma.$disconnect();
});
