using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Incident.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "incidents");

            migrationBuilder.CreateTable(
                name: "IncidentUsers",
                schema: "incidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Incidents",
                schema: "incidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Team = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Severity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ReporterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssignedToId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    LocationDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Incidents_IncidentUsers_AssignedToId",
                        column: x => x.AssignedToId,
                        principalSchema: "incidents",
                        principalTable: "IncidentUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Incidents_IncidentUsers_ReporterId",
                        column: x => x.ReporterId,
                        principalSchema: "incidents",
                        principalTable: "IncidentUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_AssignedToId",
                schema: "incidents",
                table: "Incidents",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_ReporterId",
                schema: "incidents",
                table: "Incidents",
                column: "ReporterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Incidents",
                schema: "incidents");

            migrationBuilder.DropTable(
                name: "IncidentUsers",
                schema: "incidents");
        }
    }
}
