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
            //Create Spark Session
            Modles.SparkData.Spark = SparkSession.Builder().GetOrCreate();

            #region Test

            //_ = testDir.SparkSQL.SparkSqlForSqlServer.StreamingRead(Modles.SparkData.Spark);
            //_ = testDir.Jobs.TestTaskDly.Start(Modles.SparkData.Spark);
            //_ = testDir.SparkSQL.SparkSqlForSqlServer.StreamingDeal(spark);
            //_ = testDir.SparkSQL.SparkSqlForSqlServer.ReadData(Modles.SparkData.Spark);
            //testDir.testDataFrame.dataFrame;

            #endregion Test

            _ = SparkSql.SparkSqlForSqlServer.UpdateDataFromDB();

            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}