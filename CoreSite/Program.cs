using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Spark.Sql;

namespace CoreSite
{
    public class Program
    {
        public static void Main(string[] args)
        {
            #region Test

            var spark = SparkSession.Builder().GetOrCreate();

            _ = testDir.SparkSQL.SparkSqlForSqlServer.ReadData(spark);
            //testDir.testDataFrame.dataFrame;

            #endregion Test

            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}