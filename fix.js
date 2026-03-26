const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!code.includes('import AnimatedSection')) {
  code = 'import AnimatedSection from "@/components/AnimatedSection";\n' + code;
  fs.writeFileSync('src/app/page.tsx', code);
  console.log('Added import!');
}
