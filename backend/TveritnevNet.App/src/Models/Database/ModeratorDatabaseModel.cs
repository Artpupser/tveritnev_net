using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace TveritnevNet.App.Models.Database;


[Table("moderator")]
public record ModeratorDatabaseModel {
   [Column("id")] public int Id { get; init; }
   [Column("password_hash")] public string PasswordHash { get; init; }
   [Column("username")] public string Username { get; init; }
}