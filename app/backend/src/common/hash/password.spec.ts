import { hashPassword, comparePassword } from "@/common/hash/password";

describe("Password Utilities", () => {
  const plainPassword = "TestPassword@123";

  describe("hashPassword", () => {
    it("should return a hashed string different from the original", async () => {
      const hash = await hashPassword(plainPassword);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(plainPassword);
    });

    it("should produce different hashes for the same password (salt)", async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for a correct password", async () => {
      const hash = await hashPassword(plainPassword);
      const result = await comparePassword(plainPassword, hash);
      expect(result).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
      const hash = await hashPassword(plainPassword);
      const result = await comparePassword("WrongPassword", hash);
      expect(result).toBe(false);
    });
  });
});
