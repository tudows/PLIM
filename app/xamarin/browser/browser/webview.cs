using System;

using Xamarin.Forms;

namespace browser
{
	public class webview : ContentPage
	{
		public webview ()
		{
			Content = new StackLayout { 
				Children = {
					new Label { Text = "Hello ContentPage" }
				}
			};
		}
	}
}


