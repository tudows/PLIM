package com.plim.hadoop;

import org.apache.hadoop.util.ToolRunner;

import com.plim.hadoop.job.PowerLineHealthy;

public class Main {

	public static void main(String[] args) {
		try {
			ToolRunner.run(new PowerLineHealthy(), args);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
