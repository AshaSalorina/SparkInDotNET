using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Spark.Sql.Streaming;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

namespace CoreSite.testDir.SparkSQL
{
    public class SparkSqlForSqlServer
    {
        public static async Task ReadData(SparkSession sparkSession)
        {
            DataFrame df;

            //更建议使用配置文件方式进行连接
            //这里作为测试就不多整了
            await Task.Run(() =>
            {
                #region 读取

                testDataFrame.dataFrame =
                  sparkSession.Read().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "TestTable")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Load();

                df = testDataFrame.dataFrame;

                #endregion 读取

                #region 创建局部临时表并访问

                /*
                testDataFrame.dataFrame.CreateOrReplaceTempView("TestTableUseSP");

                sparkSession.Table("TestTableUseSP").Show();
                */

                #endregion 创建局部临时表并访问

                #region 创建全局临时表并访问

                /*
                testDataFrame.dataFrame.CreateGlobalTempView("TestTableUseSP");

                sparkSession.Table("global_temp.TestTableUseSP").Show();
                */

                #endregion 创建全局临时表并访问

                #region ShowTest

                //直接利用df输出
                df.Select(df["ttuser"], df["ttage"] + 1).Show();
                Console.WriteLine("通过select用df指定输出,在其中修改值");

                //通过select选择指定列输出
                df.Select("ttuser", "ttmessage").Show();
                Console.WriteLine("通过select选择指定列输出");

                //通过where和Like选择列输出
                df.Where(df["ttuser"].Like("%up%")).Show();
                Console.WriteLine("通过where和Like选择列输出");

                //混合select和where筛选同时输出
                df.Select(df["ttuser"], df["ttage"]).Where(df["ttuser"].Like("%up%")).Where(df["ttage"] + 1 < 10).Show();
                Console.WriteLine("混合select和like筛选同时输出");

                #endregion ShowTest

                #region 写入

                /*
                testDataFrame.dataFrame.Write().Format("jdbc")
                  .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                  .Option("databaseName", "sparkDB")
                  .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                  .Option("dbtable", "TestTable")
                  .Option("user", "spark")
                  .Option("password", "aspcore")
                  .Save();
                  */

                #endregion 写入
            });
        }

        public static async Task StreamingRead(SparkSession sparkSession)
        {
            await Task.Run(() =>
            {
                sparkSession.ReadStream()
                .Option("", "")
                .Text("file://testFiles/*")
                .Show();
            });
        }
    }
}