using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Incident.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Incidents_Category",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_Severity",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_Status",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.CreateTable(
                name: "IncidentUsers",
                schema: "incidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentUsers", x => x.Id);
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

            migrationBuilder.AddForeignKey(
                name: "FK_Incidents_IncidentUsers_AssignedToId",
                schema: "incidents",
                table: "Incidents",
                column: "AssignedToId",
                principalSchema: "incidents",
                principalTable: "IncidentUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Incidents_IncidentUsers_ReporterId",
                schema: "incidents",
                table: "Incidents",
                column: "ReporterId",
                principalSchema: "incidents",
                principalTable: "IncidentUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Incidents_IncidentUsers_AssignedToId",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.DropForeignKey(
                name: "FK_Incidents_IncidentUsers_ReporterId",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.DropTable(
                name: "IncidentUsers",
                schema: "incidents");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_AssignedToId",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_ReporterId",
                schema: "incidents",
                table: "Incidents");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_Category",
                schema: "incidents",
                table: "Incidents",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_Severity",
                schema: "incidents",
                table: "Incidents",
                column: "Severity");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_Status",
                schema: "incidents",
                table: "Incidents",
                column: "Status");
        }
    }
}
