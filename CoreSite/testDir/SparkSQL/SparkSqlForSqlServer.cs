using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Spark;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

namespace CoreSite.testDir.SparkSQL
{
    public class SparkSqlForSqlServer
    {
        public static async Task ReadData(SparkSession sparkSession)
        {
            //更建议使用配置文件方式进行连接
            //这里作为测试就不多整了
            await Task.Run(() =>
            {
                testDir.testDataFrame.dataFrame = sparkSession.Read().Format("jdbc")
                  .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                  .Option("databaseName", "sparkDB")
                  .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                  .Option("dbtable", "TestTable")
                  .Option("user", "spark")
                  .Option("password", "aspcore")
                  .Load();
            });
        }
    }
}