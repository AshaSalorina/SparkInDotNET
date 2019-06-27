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

            //var spark = SparkSession.Builder().GetOrCreate();
            //Modles.testDir.testDataFrame.dataFrame = spark.Read().Csv("/spark/test1/test1.txt");
            //Modles.testDir.testDataFrame.dataFrame.Show();

            #endregion Test

            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}