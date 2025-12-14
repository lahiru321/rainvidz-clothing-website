const fs = require('fs');
const path = require('path');

const files = [
    'routes/admin/users.js',
    'routes/admin/upload.js',
    'routes/admin/orders.js',
    'routes/admin/logs.js',
    'routes/admin/homeSections.js',
    'routes/admin/collections.js',
    'routes/admin/categories.js'
];

files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace old auth import with Supabase auth
    content = content.replace(
        /const { verifyToken } = require\('\.\.\/\.\.\/middleware\/auth'\);?/g,
        "const { verifySupabaseToken } = require('../../middleware/supabaseAuth');\nconst { verifyAdmin } = require('../../middleware/adminAuth');"
    );

    // Replace router.use(verifyToken) with both middlewares
    content = content.replace(
        /router\.use\(verifyToken\);?/g,
        "router.use(verifySupabaseToken);\nrouter.use(verifyAdmin);"
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
});

console.log('\n🎉 All admin routes updated to use Supabase authentication!');
