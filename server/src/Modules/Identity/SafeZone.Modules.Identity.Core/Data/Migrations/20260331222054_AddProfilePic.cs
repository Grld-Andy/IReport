using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Identity.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProfilePic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePicUrl",
                schema: "users",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePicUrl",
                schema: "users",
                table: "Users");
        }
    }
}
