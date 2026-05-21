using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace TveritnevNet.App.Models.Database;


public enum UserDatabaseRole {
   Member = 0,
   Admin = 1,
}

[Table("users")]
public record UsersDatabaseModel {
   [Column("id")] public int Id { get; init; }
   [Column("password")] public string Password { get; init; }
   [Column("username")] public string Username { get; init; }
   [Column("role")] public UserDatabaseRole Role { get; init; }

   public bool IsRole(UserDatabaseRole role) => role <= Role;
}