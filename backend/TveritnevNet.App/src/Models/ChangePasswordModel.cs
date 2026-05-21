using System.Text.Json.Serialization;

using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Models;

public record ChangePasswordModel {
   [ValidRule("need~")]
   [ValidRule("string_range~1 128")]
   [JsonPropertyName("current_password")]
   public string CurrentPassword { get; set; }
   [ValidRule("need~")]
   [ValidRule("string_range~1 128")]
   [JsonPropertyName("new_password")]
   public string NewPassword { get; set; }
   [ValidRule("need~")]
   [ValidRule("string_range~1 128")]
   [JsonPropertyName("repeat_password")]
   public string RepeatPassword { get; set; }
}