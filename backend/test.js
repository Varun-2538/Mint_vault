import crypto from "crypto";

// Replace these with your actual values
const PAYU_SALT = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdBV/5jTrrSi2CDMN6KWX2yaMzO6+tjGnHWVsq+LuTUEc9wsNRFVtZuRUWfpwiF8XrQ5YEqIBvCv8ck9tS+yddU9eKc7iPaDbkMItk/eWJBcFmWPgr3lsTRR7ESahHyK5gBXhFoi7ecSn2Xdw0m3Q4Gm3hg9Cv9+jflXYyb4WwnVLi3q4Y6/mmdD/LjiEm7XVV97NnV+exyy7OBEBPeUingxRCz5hIV6I5fd0G7Lu05wBSOKymoNhuuHmjEf6zEfrwVVZPhZsLgt3M6XIaNohBZLIu8ELeG7GS+etoJ/3+f/I2VivrG9noHBVWIBm+Rbz8ktbfEnqtoN4a9j/qya0fAgMBAAECggEAKKsjhMy66a6FfyeQFHtnmqhxkizKX5m1oQvNHbQU979OzIt42wOeAn1u5uu3GQLc1TRjd0n2D/irBnwiYDt8e8zAnWY7sI+Rgh14mMWrJbJcatO2HoRUp9ARIDcZctP3Wg3HmrCEBUQ3X3DX4wozsVsTmuphTO/F9tYOoKsqo1uH6gTaKea0kVDQgW0iZf7g4f7jlxiJzLclx6S3E9QPUW9Nd2K5q+oKOZ2G4gj6Mr3gEwkC+9ecbRA07HcI6ep808VBjXYrtVmfYAK06qeiPkSctRLkPyprZ5UOCltnThML0HsCWN8Ltc/+Qo63VlfVCdxv1scmZ5qSufyJKgJhqQKBgQDuUDHy6GUB3FfuAdcbCE+yNvqvtlrRfCzhEF7YFBZwZTL/PaUcpNyvdAq4X6fzGdY85C0A0p2Axz7bYX8wIzB4VtMT5HNvv3b4pZ8Xqm5pNb/9oA1jD2owAHV0DiwGANg+3qrT4QSE7DsD14kHczq+M2Ls5mdXVmlpqizDH/UyuwKBgQDtbKMsnwFoFxmVsbveKffGiqUtg0I7T/GCu5OPPUBYN3kOXGREWEWukelAIgnpJ9q354l+rWKMb7FzXAEgMDxlkv1hayP6A3qWuGN9ag84HnSO/VPpYWR/IYb1QG+3VqkgEOVNeE21TX1VScBy7RR5++oOSh/O+2bfkj0DI4jC7QKBgQDIk1im4G/7E/Ax0vyvtNwW2+08LJfdjszbFIMvDCEishos9z5bkGpphZpsOZ5KnmlRUJ6L/bgwpgHCdRmucz+dWT5IlNOPry878XGoYnqRNHsFxUrfIB84jXpNlov49YcLyy8uK0o5cfXtst+TFKnRYcCWMQmzWXhZRbBs/h3KdwKBgDmWWB3Ck3zD3ZjJe1/vngGyL05SwAXS5ilnhesAWFMNYXdyQX+ySXSGP6UmnHDJEev5ZQgs1fJqRQhOEJfWG1Anzv2KFzfVEC7umnMY/ogGGw9zsp6w2MddQnbKIk693lfAwV2BCJgpK3U8Zkl557WOvL6qi/yQTet8dQAF5m4hAoGAEFOu2lnRlMqv7F20nnGUgOFEIPQHc7q7yJe+xqGfCPKP4Q+yvIHh09egehmjnu7zSvL5446RGOChDeu2y8KUcR8e8lUVJtZmHg1oB9T1ANuUnemiSBuexDSqfQACcsiqMALQUZQn+N3ZimuHGsL0ZCS8J1fZ2puhiQxkb6Sjuvk=";
const PAYU_KEY = "4uMgQm";
const txnid = "12345";
const amount = "100";
const status = "success";
const productinfo = "product";
const firstname = "John";
const email = "john.doe@example.com";

// Create the reverse hash string
const reverseHashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
console.log("Reverse Hash String:", reverseHashString);

// Calculate the hash
const calculatedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");
console.log("Calculated Hash:", calculatedHash);
