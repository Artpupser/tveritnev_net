using System.Text.Json.Serialization;

using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Models;

public record LoginModel {
   [ValidRule("need~")]
   [ValidRule("string_range~1 128")]
   [JsonPropertyName("username")]
   public string Username { get; set; }

   [ValidRule("need~")]
   [ValidRule("string_range~1 128")]
   [JsonPropertyName("password")]
   public string Password { get; set; }
}