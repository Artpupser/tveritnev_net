using System.ComponentModel.DataAnnotations.Schema;

namespace TveritnevNet.App.Models.Database;

[Table("configs")]
public record ConfigsDatabaseModel {
   [Column("id")] public int Id { get; init; }
   [Column("name")] public string Name { get; set; }
   [Column("json")] public string Json { get; init; } 
}