using System.Text.Json.Serialization;

using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Models;

public record ConfigSaveModel {
   [ValidRule("need~")]
   [ValidRule("string_range~1 32")]
   [JsonPropertyName("name")]
   public string Name { get; set; }

   [ValidRule("need~")]
   [ValidRule("json~")]
   [JsonPropertyName("json")]
   public string Json { get; set; }
}