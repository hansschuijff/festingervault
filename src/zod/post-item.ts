import { z } from "zod";
export const ItemTypeEnum = z.enum([
  "wordpress-themes",
  "wordpress-plugins",
  "elementor-template-kits",
]);
