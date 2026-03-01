# aqua-regia

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run 
```
or
```bash
docker run --rm \
  -e API_SECRET="your-secret-key" \
  -e API_BASE_URL="https://aimas.bangmarcel.art/api" \
  -e SOURCE_BASE_URL="https://harga-emas.org" \
  marcelaritonang/aqua-regia:latest
```
or

`docker run --rm -e API_SECRET="your-secret-key" marcelaritonang/aqua-regia:latest`

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

