using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace vega.Migrations
{
    public partial class SeedFeatures : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Features (Name) VALUES ('Airconditioning')");
            migrationBuilder.Sql("INSERT INTO Features (Name) VALUES ('GPS')");
            migrationBuilder.Sql("INSERT INTO Features (Name) VALUES ('ABS')");
            migrationBuilder.Sql("INSERT INTO Features (Name) VALUES ('Airbag')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Features");
        }
    }
}
