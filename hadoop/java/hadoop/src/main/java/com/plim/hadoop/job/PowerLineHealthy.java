package com.plim.hadoop.job;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.bson.BSONObject;
import org.bson.BasicBSONObject;
import org.bson.Document;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.hadoop.MongoConfig;
import com.mongodb.hadoop.MongoInputFormat;
import com.mongodb.hadoop.MongoOutputFormat;
import com.mongodb.hadoop.io.BSONWritable;
import com.mongodb.hadoop.io.MongoUpdateWritable;
import com.mongodb.hadoop.util.MongoTool;

public class PowerLineHealthy extends MongoTool {
	
	public static MongoClient mongo = new MongoClient(new MongoClientURI("mongodb://rabbit:zhengran14@192.168.1.101:27017/PLIM"));
	public static MongoDatabase plim = mongo.getDatabase("PLIM");
	
	public PowerLineHealthy() {
		try {
			Configuration conf = new Configuration();
			MongoConfig config = new MongoConfig(conf);
			setConf(conf);
			config.setInputFormat(MongoInputFormat.class);
			config.setInputURI("mongodb://rabbit:zhengran14@192.168.1.101:27017/PLIM.operationparameters");
			config.setMapper(PowerLineHealthyMapper.class);
			config.setReducer(PowerLineHealthyReducer.class);
			config.setMapperOutputKey(Text.class);
			config.setMapperOutputValue(Text.class);
			config.setOutputKey(Text.class);
			config.setOutputValue(BSONWritable.class);
			config.setOutputURI("mongodb://rabbit:zhengran14@192.168.1.101:27017/PLIM.operationparameters");
			config.setOutputFormat(MongoOutputFormat.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static class PowerLineHealthyMapper extends Mapper<Object, BSONObject, Text, Text> {
		@Override
		public void map(Object key, BSONObject val, final Context context) {
			try {
				MongoCollection<Document> collectiom = plim.getCollection("powerlines");
				BasicDBObject query = new BasicDBObject();
				query.append("operationParameter", val.get("_id"));
				FindIterable<Document> findIterable = collectiom.find(query);
				MongoCursor<Document> mongoCursor = findIterable.iterator();
				Map<String, Object> powerline = null;
				while (mongoCursor.hasNext()) {
					powerline = (Map<String, Object>) mongoCursor.next();
					break;
				}
				
				collectiom = plim.getCollection("standardoperationparameters");
				query = new BasicDBObject();
				query.append("_id", powerline.get("standardOperationParameter"));
				findIterable = collectiom.find(query);
				mongoCursor = findIterable.iterator();
				Map<String, Object> standardoperationparameter = null;
				while (mongoCursor.hasNext()) {
					standardoperationparameter = (Map<String, Object>) mongoCursor.next();
					break;
				}
				
				double volt = Double.valueOf((String) val.get("volt"));
				double ampere = Double.valueOf((String) val.get("ampere"));
				double ohm = Double.valueOf((String) val.get("ohm"));
				double celsius = Double.valueOf((String) val.get("celsius"));
				double pullNewton = Double.valueOf((String) val.get("pullNewton"));
				List<Map<String, Object>> environment = (List<Map<String, Object>>) val.get("environment");
				
				Integer healthy = 100;
				
				if (volt <= 0 || ampere <= 0 || ohm <= 0 || pullNewton <= 0) {
					healthy = 0;
				}
				
				double minVolt = Double.valueOf(standardoperationparameter.get("minVolt").toString());
				double maxVolt = Double.valueOf(standardoperationparameter.get("maxVolt").toString());
				if (volt < minVolt || volt > maxVolt) {
					healthy -= 10;
					double voltDiffUp = volt - minVolt;
					double voltDiffDown = maxVolt - minVolt;
					int voltLoad = (int) (voltDiffUp / voltDiffDown * 100);
                    if (voltLoad > 500) {
                    	healthy -= (int) (voltLoad / 500 * 10);
                    }
				}
				double minAmpere = Double.valueOf(standardoperationparameter.get("minAmpere").toString());
				double maxAmpere = Double.valueOf(standardoperationparameter.get("maxAmpere").toString());
				if (ampere < minAmpere || ampere > maxAmpere) {
					healthy -= 5;
					double ampereDiffUp = ampere - minAmpere;
					double ampereDiffDown = maxAmpere - minAmpere;
					int ampereLoad = (int) (ampereDiffUp / ampereDiffDown * 100);
                    if (ampereLoad > 500) {
                    	healthy -= (int) (ampereLoad / 500 * 10);
                    }
				}
				double minCelsius = Double.valueOf(standardoperationparameter.get("minCelsius").toString());
				double maxCelsius = Double.valueOf(standardoperationparameter.get("maxCelsius").toString());
				if (celsius < minCelsius || celsius > maxCelsius) {
					healthy -= 5;
					double celsiusDiffUp = celsius - minCelsius;
					double celsiusDiffDown = maxCelsius - minCelsius;
					int celsiusLoad = (int) (celsiusDiffUp / celsiusDiffDown * 100);
                    if (celsiusLoad > 120) {
                    	healthy -= (int) (celsiusLoad / 120 * 10);
                    }
				}
				double minPullNewton = Double.valueOf(standardoperationparameter.get("minPullNewton").toString());
				double maxPullNewton = Double.valueOf(standardoperationparameter.get("maxPullNewton").toString());
				if (pullNewton < minPullNewton || pullNewton > maxPullNewton) {
					healthy -= 5;
					double pullNewtonDiffUp = pullNewton - minPullNewton;
					double pullNewtonDiffDown = maxPullNewton - minPullNewton;
					int pullNewtonLoad = (int) (pullNewtonDiffUp / pullNewtonDiffDown * 100);
                    if (pullNewtonLoad > 300) {
                    	healthy -= (int) (pullNewtonLoad / 300 * 10);
                    }
				}
				
				Date lastRepairDate = null;
				Date lastMaintainDate = null;
				Date serviceDate = (Date) powerline.get("serviceDate");
				Date nowDate = new Date();
				if (powerline.get("lastRepairDate") != null) {
					lastRepairDate = (Date) powerline.get("lastRepairDate");
				} else {
					lastRepairDate = serviceDate;
				}
				if (powerline.get("lastMaintainDate") != null) {
					lastMaintainDate = (Date) powerline.get("lastMaintainDate");
				} else {
					lastMaintainDate = serviceDate;
				}
				int repairDiff = (int) ((nowDate.getTime() - lastRepairDate.getTime()) / (1000 * 60 * 60 * 24));
				if (repairDiff > (int) powerline.get("repairDay")) {
					healthy -= (int) ((repairDiff - (int) powerline.get("repairDay") / 90 * 10));
				}
				int maintainDiff = (int) ((nowDate.getTime() - lastMaintainDate.getTime()) / (1000 * 60 * 60 * 24));
				if (maintainDiff > (int) powerline.get("maintainDay")) {
					healthy -= (int) ((maintainDiff - (int) powerline.get("maintainDay")) / 180 * 5);
				}
				int serviceDiff = nowDate.getYear() - serviceDate.getYear();
				if (serviceDiff > (int) powerline.get("designYear")) {
					healthy -= (serviceDiff - (int) powerline.get("designYear")) * 5;
				}
				
				context.write(new Text(val.get("_id").toString()), new Text((healthy < 0 ? 0 : healthy) + ""));
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	public static class PowerLineHealthyReducer extends Reducer<Text, Text, NullWritable, MongoUpdateWritable> {

		@Override
		public void reduce(final Text pKey, final Iterable<Text> pValues, final Context pContext) {
			try {
				String healthy = null;
		        for(Text value : pValues){
		            healthy = value.toString();
		            break;
		        }
		        if (healthy != null) {
					BasicBSONObject query = new BasicBSONObject("_id", new ObjectId(pKey.toString()));
			        BasicBSONObject update = new BasicBSONObject("$set", new BasicBSONObject("healthy", healthy));
			        pContext.write(null, new MongoUpdateWritable(query, update, true, false));
		        }
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}
}
