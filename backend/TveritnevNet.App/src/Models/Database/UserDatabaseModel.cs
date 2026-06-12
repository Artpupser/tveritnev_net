using System.ComponentModel.DataAnnotations.Schema;
using TveritnevNet.App.Models.Enums;

namespace TveritnevNet.App.Models.Database;


[Table("users")]
public record UserDatabaseModel
{
    [Column("id")] public int Id { get; init; }
    [Column("password")] public string Password { get; init; }
    [Column("username")] public string Username { get; init; }
    [Column("role")] public UserDatabaseRole Role { get; init; }

    public bool IsRole(UserDatabaseRole role)
    {
        return role <= Role;
    }
}
