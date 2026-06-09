using System.ComponentModel.DataAnnotations.Schema;


namespace TveritnevNet.App.Models.Database;

[Table("session")]
public record SessionDatabaseModel {
   [Column("id")] public int Id { get; init; }
   [Column("user_id")] public int UserId { get; init; }
   [Column("token")] public string Token { get; init; }
   [Column("created_at")] public DateTimeOffset CreatedAt { get; init; }
   [Column("updated_at")] public DateTimeOffset UpdatedAt { get; init; }
   [Column("expired_at")] public DateTimeOffset ExpiredAt { get; init; }

   public bool IsExpired() {
      return ExpiredAt < DateTimeOffset.Now;
   }
}