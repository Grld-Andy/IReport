using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeZone.Modules.Payments.Core.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckedOut : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RawResponse",
                schema: "payments",
                table: "receipts");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaitAt",
                schema: "payments",
                table: "receipts",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "CheckedOut",
                schema: "payments",
                table: "receipts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                schema: "payments",
                table: "receipts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedOut",
                schema: "payments",
                table: "receipts");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                schema: "payments",
                table: "receipts");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaitAt",
                schema: "payments",
                table: "receipts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RawResponse",
                schema: "payments",
                table: "receipts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
