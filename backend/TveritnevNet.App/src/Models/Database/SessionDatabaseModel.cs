using System.ComponentModel.DataAnnotations.Schema;


namespace VelvetScroll.App.Models.Database;

[Table("session")]
public record SessionDatabaseModel {
   [Column("id")] public int Id { get; set; }
   [Column("user_id")] public int UserId { get; set; }
   [Column("token")] public string Token { get; set; }
   [Column("created_at")] public DateTimeOffset CreatedAt { get; set; }
   [Column("updated_at")] public DateTimeOffset UpdatedAt { get; set; }
   [Column("expired_at")] public DateTimeOffset ExpiredAt { get; set; }

   public bool IsExpired() => ExpiredAt < DateTimeOffset.Now;
   public bool IsUpdated() => CreatedAt != UpdatedAt;
}