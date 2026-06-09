using System.Runtime.Serialization;

namespace TveritnevNet.App.Models.Enums;

public enum UserDatabaseRole : byte
{
    [EnumMember(Value = "member")] Member = 0,
    [EnumMember(Value = "admin")] Admin = 1
}
