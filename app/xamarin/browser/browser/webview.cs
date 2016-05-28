using System;

using Xamarin.Forms;

namespace browser
{
	public class webview : ContentPage
	{
		public webview ()
		{
//			Content = new StackLayout { 
//				Children = {
//					new Label { Text = "Hello ContentPage" }
//				}
//			};

			var stack = new StackLayout ();
			stack.Children.Add (new WebView { Source = "http://xamarin.com", HeightRequest = 1000, WidthRequest = 1000 });
			Content = stack;
		}
	}
}


