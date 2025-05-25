import type { Package, PackageCart, Test, TestCart } from '@/types';

// Get cart items from localStorage
export const getCartItems = () => {
    try {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]') as TestCart[];
        const packages = JSON.parse(localStorage.getItem('packages') || '[]') as PackageCart[];
        return { tests, packages };
    } catch (error) {
        console.error('Error getting cart items:', error);
        return { tests: [], packages: [] };
    }
};

// Add test to cart
export const addTestToCart = (test: Test, unit = 1) => {
    try {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]') as TestCart[];

        // Check if test already exists in cart
        const existingTestIndex = tests.findIndex((item) => item.test_id === test.id);

        if (existingTestIndex !== -1) {
            // Update quantity if test already exists
            tests[existingTestIndex].unit += unit;
        } else {
            // Add new test to cart
            tests.push({
                test_id: test.id,
                slug: test.slug,
                unit: unit,
                test: test,
            });
        }

        localStorage.setItem('tests', JSON.stringify(tests));
        return tests;
    } catch (error) {
        console.error('Error adding test to cart:', error);
        return [];
    }
};

// Add package to cart
export const addPackageToCart = (packageItem: Package, quantity = 1) => {
    try {
        const packages = JSON.parse(localStorage.getItem('packages') || '[]') as PackageCart[];

        // Check if package already exists in cart
        const existingPackageIndex = packages.findIndex((item) => item.package_id === packageItem.id);

        if (existingPackageIndex !== -1) {
            // Update quantity if package already exists
            packages[existingPackageIndex].quantity = (packages[existingPackageIndex].quantity || 1) + quantity;
        } else {
            // Add new package to cart
            packages.push({
                package_id: packageItem.id,
                slug: packageItem.slug,
                quantity: quantity,
                package: packageItem,
            });
        }

        localStorage.setItem('packages', JSON.stringify(packages));
        return packages;
    } catch (error) {
        console.error('Error adding package to cart:', error);
        return [];
    }
};

// Remove item from cart
export const removeFromCart = (type: 'test' | 'package', id: number) => {
    try {
        if (type === 'test') {
            const tests = JSON.parse(localStorage.getItem('tests') || '[]') as TestCart[];
            const updatedTests = tests.filter((item) => item.test_id !== id);
            localStorage.setItem('tests', JSON.stringify(updatedTests));
            return updatedTests;
        } else {
            const packages = JSON.parse(localStorage.getItem('packages') || '[]') as PackageCart[];
            const updatedPackages = packages.filter((item) => item.package_id !== id);
            localStorage.setItem('packages', JSON.stringify(updatedPackages));
            return updatedPackages;
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return [];
    }
};

// Calculate cart total
export const calculateCartTotal = () => {
    try {
        const { tests, packages } = getCartItems();

        let subtotal = 0;

        // Add test prices
        tests.forEach((item) => {
            subtotal += item.test.price * item.unit;
        });

        // Add package prices
        packages.forEach((item) => {
            subtotal += item.package.price * (item.quantity || 1);
        });

        const tax = Math.round(subtotal * 0.1); // 10% tax
        const shipping = subtotal > 0 ? 50000 : 0; // Shipping fee if cart is not empty
        const total = subtotal + tax + shipping;

        return { subtotal, tax, shipping, total };
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    }
};
