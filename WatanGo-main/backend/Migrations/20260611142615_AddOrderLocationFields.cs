using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatanGo.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderLocationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DriverLat",
                table: "Orders",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DriverLng",
                table: "Orders",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DriverUpdatedAtUtc",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "UserLat",
                table: "Orders",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "UserLng",
                table: "Orders",
                type: "decimal(9,6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UserUpdatedAtUtc",
                table: "Orders",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DriverLat",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DriverLng",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DriverUpdatedAtUtc",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UserLat",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UserLng",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UserUpdatedAtUtc",
                table: "Orders");
        }
    }
}
