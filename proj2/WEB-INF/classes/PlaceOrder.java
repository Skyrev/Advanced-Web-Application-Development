import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import sdsu.*;


public class PlaceOrder extends HttpServlet {
	
	Cookie[] cookies;
	String orderInfo;
	int updatedRowsCount;
    
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {   
	    
		response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
		updatedRowsCount = 0;
		
		cookies = request.getCookies();
		for(Cookie cookie : cookies) {
			if(cookie.getName().equals("jadrn035")) {
				orderInfo = cookie.getValue();
				break;
			}
		}
		
		orderInfo = orderInfo.replace("||", "@").replace("|", ",");
		String[] product = orderInfo.split("@");
		for(int i = 0; i < product.length; i++) {
			String[] skuQty = product[i].split(",");
			String query = "UPDATE products SET quantity = quantity - " + skuQty[1] + " WHERE sku = '" + skuQty[0] + "';";
			updatedRowsCount += DBHelper.runUpdate(query);
		}
		
	    out.print(updatedRowsCount);
    }  
}