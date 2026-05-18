using System.Text.Json.Serialization;

using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Models;

public record ConfigurationModel {
   [ValidRule("need~")]
   [ValidRule("json~")]
   [JsonPropertyName("panel")]
   public string PanelJson { get; set; }
   [ValidRule("need~")]
   [ValidRule("json~")]
   [JsonPropertyName("settings")]
   public string SettingsJson { get; set; }
}