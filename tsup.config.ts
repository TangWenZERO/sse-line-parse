import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // 生成 commonjs 和 esm 格式的文件
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true, // 生成类型定义文件
});