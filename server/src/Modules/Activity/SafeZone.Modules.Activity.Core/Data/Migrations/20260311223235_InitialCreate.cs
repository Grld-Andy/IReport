using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Activity.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "activities");

            migrationBuilder.CreateTable(
                name: "Activities",
                schema: "activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ActorId = table.Column<Guid>(type: "uuid", nullable: true),
                    ActorName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Action = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Details = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Module = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_CreatedAt",
                schema: "activities",
                table: "Activities",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities",
                schema: "activities");
        }
    }
}
