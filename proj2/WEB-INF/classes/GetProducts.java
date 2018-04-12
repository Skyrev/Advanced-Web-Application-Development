import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import sdsu.*;


public class GetProducts extends HttpServlet {
	
	Vector<String[]> resultSet;
	String output;
    
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {   
	    
		response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
		resultSet = new Vector<String[]>();
		output = "";
	    String query = "SELECT sku, category, vendor, mfg_id, description, features, cost, retail, quantity, image FROM products;";
		resultSet = DBHelper.runQuery(query);
		
		for(int i = 0; i < resultSet.size(); i++) {
			for(int j = 0; j < resultSet.get(i).length; j++) {
				if(j != resultSet.get(i).length-1)
					output += resultSet.get(i)[j] + "|";
				else
					output += resultSet.get(i)[j];
			}
			if(i != resultSet.size()-1)
				output += "^";
		}
		
	    out.print(output);
    }  
}