public class Admin
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public string? Role { get; set; }   // optional
    public string? UserCategory { get; set; } 
    public int? SocietyId { get; set; } 
}
