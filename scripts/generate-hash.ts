import { generateAdminKeyHash } from "@/src/lib/crypto"

async function main() {
  const key = "5543"
  const hash = await generateAdminKeyHash(key)
  console.log(`Add this to your .env file:\nADMIN_HASH=${JSON.stringify(hash)}`)
}

main()