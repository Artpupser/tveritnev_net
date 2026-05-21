using System.Text.Json.Serialization;

using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Models;

public record ImageLoadModel {
   [ValidRule("need~")]
   [ValidRule("string_range~1 32")]
   [JsonPropertyName("name")]
   public string Name { get; set; }
   [ValidRule("need~")]
   [ValidRule("img~")]
   [JsonPropertyName("image")]
   public byte[] Image { get; set; }
}

public record ImageDeleteModel {
   [ValidRule("need~")]
   [ValidRule("string_range~1 32")]
   [JsonPropertyName("name")]
   public string Name { get; set; }
}