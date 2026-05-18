using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace TveritnevNet.App.Models.Database;

public enum UserDatabaseModelRole : byte {
   [EnumMember(Value = "admin")]
   Admin = 0
}

[Table("users")]
public record UserDatabaseModel {
   [Column("id")] public int Id { get; set; }
   [Column("role")] public UserDatabaseModelRole Role { get; set; }
   [Column("password_hash")] public string PasswordHash { get; set; }
   [Column("username")] public string Username { get; set; }
   [Column("created_at")] public DateTimeOffset CreatedAt { get; set; }
   
   public bool IsRole(UserDatabaseModelRole role) => Role == role;
}