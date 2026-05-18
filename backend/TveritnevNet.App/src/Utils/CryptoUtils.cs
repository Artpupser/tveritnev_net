using System.Security.Cryptography;
using System.Text;

namespace TveritnevNet.App.Utils;

public static class CryptoUtils {
   public static string Sha256(string text)
   {
      return Convert.ToHexString(SHA256.HashData( Encoding.UTF8.GetBytes(text))).ToLowerInvariant();
   }
   
   public static string Sha512(string text)
   {
      return Convert.ToHexString(SHA512.HashData( Encoding.UTF8.GetBytes(text))).ToLowerInvariant();
   }
   
   public static string Md5(string text)
   {
      return Convert.ToHexString(MD5.HashData( Encoding.UTF8.GetBytes(text))).ToLowerInvariant();
   }
}