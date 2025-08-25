
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Services;
using MemberManagementAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://0.0.0.0:4200", "http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("MemberManagementDB"));

// Add Services
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IMemberService, MemberService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

// Seed some sample data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var memberService = scope.ServiceProvider.GetRequiredService<IMemberService>();
    
    if (!context.Members.Any())
    {
        var sampleMembers = new[]
        {
            new MemberManagementAPI.Models.Member
            {
                MemberNo = "MEM001",
                Name = "John Doe",
                FHName = "Robert Doe",
                Mobile = "9876543210",
                Email = "john@example.com",
                Designation = "Manager",
                Branch = "Main Branch",
                ShareAmount = 10000,
                CDAmount = 5000,
                Status = "Active",
                CreatedDate = DateTime.UtcNow
            },
            new MemberManagementAPI.Models.Member
            {
                MemberNo = "MEM002",
                Name = "Jane Smith",
                FHName = "William Smith",
                Mobile = "9876543211",
                Email = "jane@example.com",
                Designation = "Executive",
                Branch = "North Branch",
                ShareAmount = 15000,
                CDAmount = 7500,
                Status = "Active",
                CreatedDate = DateTime.UtcNow
            }
        };
        
        foreach (var member in sampleMembers)
        {
            await memberService.CreateMemberAsync(member);
        }
    }
}

app.Run();
