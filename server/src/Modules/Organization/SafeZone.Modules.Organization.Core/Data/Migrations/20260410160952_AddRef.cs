using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Organization.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRef : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentReferene",
                schema: "organization",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Name",
                schema: "organization",
                table: "Companies",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Companies_Name",
                schema: "organization",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PaymentReferene",
                schema: "organization",
                table: "Companies");
        }
    }
}
