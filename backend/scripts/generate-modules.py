import os

modules = [
    "auth", "workspace", "market", "review", 
    "sourcing", "strategy", "creative", "audit", "learning"
]

base_dir = "backend/src/modules"

for mod in modules:
    mod_path = os.path.join(base_dir, mod)
    
    # Capitalize module name for class names (e.g., sourcing -> Sourcing)
    class_name = mod.capitalize()
    
    # Define file contents
    files = {
        "controller.ts": f"export class {class_name}Controller {{}}\n",
        "service.ts": f"export class {class_name}Service {{}}\n",
        "repository.ts": f"export class {class_name}Repository {{}}\n",
        "schema.ts": "import { z } from 'zod';\n\nexport const placeholderSchema = z.object({});\n",
        "route.ts": f"import {{ FastifyInstance }} from 'fastify';\n\nexport async function {mod}Routes(_fastify: FastifyInstance) {{}}\n",
        "types.ts": f"export interface {class_name}Placeholder {{}}\n"
    }
    
    # Write files
    for filename, content in files.items():
        filepath = os.path.join(mod_path, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("✅ Successfully generated placeholders for 9 modules.")
