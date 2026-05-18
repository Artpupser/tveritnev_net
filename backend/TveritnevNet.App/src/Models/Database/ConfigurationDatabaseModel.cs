using System.ComponentModel.DataAnnotations.Schema;

namespace TveritnevNet.App.Models.Database;

[Table("configuration")]
public record ConfigurationDatabaseModel {
   [Column("panel_json")] public string PanelJson { get; init; } 
   [Column("settings_json")] public string SettingsJson { get; init; } 
}