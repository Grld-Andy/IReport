using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Incident.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCategoryType1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Category",
                schema: "incidents",
                table: "Incidents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Category",
                schema: "incidents",
                table: "Incidents",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
