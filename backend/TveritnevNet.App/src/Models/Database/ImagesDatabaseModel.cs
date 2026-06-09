using System.ComponentModel.DataAnnotations.Schema;

namespace TveritnevNet.App.Models.Database;

[Table("images")]
public sealed record ImagesDatabaseModel {
   [Column("id")] public int Id { get; init; }
   [Column("name")] public string Name { get; init; }
}