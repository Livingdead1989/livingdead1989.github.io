---
title:  "Learning WordPress"
date:   2018-12-13 09:50:44 +0000
categories: wordpress
---

WordPress ([Wordpress.org](https://wordpress.org/)) is a free and open-source content management system (CMS) based on PHP and MySQL.
Features include a plugin architecture and a template system.

# Contents
1. [Variables](#variables)
2. [Arrays](#arrays)
3. [Loops](#loops)
	1. [ForEach](#foreach)
	2. [While](#while)
4. [Functions](#functions)
5. [The WordPress Loop](#the-wordpress-loop)
6. [Template Tags](#template-tags)
7. [Conditional Tags](#conditional-tags)
8. [Hooks](#hooks)
	1. [Action Hook](#action-hook)
	2. [Filter Hook](#filter-hook)
9. [Starter Themes](#starter-themes)
10. [Parent and Child Themes](#parent-and-child-themes)
11. [Theme Information](#theme-information)
12. [Stylesheets](#stylesheets)
13. [Theme Support](#theme-support)
14. [Templates](#templates)
15. [Template Hierarchy](#template-hierarchy)
16. [Fallback Architecture](#fallback-architecture)
17. [Register Menus](#register-menus)
18. [Register Sidebar](#register-sidebar)

1.[Simple Project](#simple-project)


--- 

<br>
## Variables
A variable is created by starting with a dollar symbol ($) for example:

```php
$name = "John Doe";
```

Variable name must not contain spaces instead use the underscore, WordPress does not recommend camelCase and perfer a human understandable naming convention.

```php
$client_fullname = "John Doe";
```


## Arrays
An array is created with square brackets and array items are seperated with a comma (,)

```php
$client_list = [
				"John Doe",
				"Natasha Jones",
				"William Smith"
				];
```

The last item does not require closing as the array gets closed with a semi-colon (;).
You can echo an array using a loop or th `var_export` this will allow you to dump the array contents for example:

```php
var_export( $client_list );

```

results in the following:

```
array(0>'John Doe',1=>'Natasha Jones',2=>'William Smith')
```


## Loops
### ForEach
An example of a ForEach loop:

```php
foreach ( $array as $array_item ){ 
		echo $array_item;
	};
```

### While
An example of a While loop:
```php
while ( have_posts() ):
	the_post();
endwhile;
```

## Functions
A function is a re-usable piece of code that can accept parameters.
Functions do not automatically run instead they must be called, an example of a function is:

```php
function display-posts( $title ){
	echo "<h3>$title</h3>";
}

display-posts("Hello PHP");
```

The first part is the creation of the function and the second is calling that function.

## The WordPress Loop
_[Codex](https://codex.wordpress.org/The_Loop)_

There are a couple different ways to write the loop but the suggested way by WordPress is the following: 

```php
<?php if( have_posts() ): 
	while( have_posts() ):
		the_post(); ?>

			<h1><?php the_title(); ?></h1>
			<?php the_content(); ?>

<?php endwhile; else: ?>

	<p><?php _e( 'sorry, no content','textdomain' ); ?></p>

<?php endif; ?>
```

The loop comprises of an IF statement which checks that there are posts available if this IF returns true then a WHILE statement inside loops through the posts and performs a 'the_post()' function per post.

If the IF statement returns false then a translatable error message will be echoed.

## Template Tags
_[Codex](https://codex.wordpress.org/Template_Tags)_

A template tag is a WordPress function that is used to call/get content for example

```
the_title()
wp_tag_cloud()
body_class()
```

Used template tags when learning WordPress

* get_header(); = includes the header.php template file from your current theme's directory. custom header files can be called using get_header( 'custom_name' )
* [wp_head();](https://developer.wordpress.org/reference/hooks/wp_head/) = fires the wp_head action hook.
* get_footer(); = includes the footer.php template file from your current theme's directory.
* [wp_footer();](https://developer.wordpress.org/reference/hooks/wp_footer/) = fires the wp_footer action hook.
* [wp_nav_menu();](https://developer.wordpress.org/reference/functions/wp_nav_menu/) = displays a navigation menu.
* [body_class();](https://developer.wordpress.org/reference/functions/body_class/) = display the classes for the body element.
* [bloginfo();](https://developer.wordpress.org/reference/functions/bloginfo/) = displays information about the current site.

## Conditional Tags
_[Codex](https://codex.wordpress.org/Conditional_Tags)_

A conditional tag will return true or false (similar to an IF statement), a conditional tag can be used to filter content for example:

```
is_front_page()
is_admin_bar_showing()
is_single()
```

We can use conditional tags is conjunction with IF statements for example:

```php
<?php if( is_front_page() && !is_home() ): ?>

	<h1>Static Front Page</h1>

<?php endif; ?>
```


## Hooks
Hooks are generally used in plugins or the functions.php file in themes

### Action Hook
Action hooks allow you to run your own code when events take place.
Action hooks allow you to add scripts and styles without causing duplications, priorities can be added after the function name to control the loading process.

```php
function themename_enqueue_styles(){
	// No Deps (empty array) and Dev Time Versioning Trick
	wp_enqueue_style( 'main-css', get_stylesheet_directory_uri() . '/style.css', [], time() );
}

add_action( 'wp_enqueue_scripts', 'themename_enqueue_styles' );
```

### Filter Hook
Filter hooks let you modify how content is displayed on a page or saved to the database.


## Starter Themes
A starter theme is a bare bones/framework, a starting place to create a new theme similar to how HTML boiler plates work.


## Parent and Child Themes
_[Codex](https://codex.wordpress.org/Child_Themes)_

**Parent themes** is any theme installed on a WordPress instance.

**Child themes** allow the developer to alter the parent theme without making changes directly to that theme, this allows for updates to be added to the parent theme without destroying your child theme changes.

The child theme only needs to reference the parent theme in the style.css by using the meta data "Template Name: " 

**_If the parent theme is not available the child theme will not appear in the web panel._**

The child theme uses all the parent files but keeps its own modified versions so any changes are not lost when updating the parent theme.

Enqueuing styles are slightly different in child themes

```php
function theme_styles(){
	wp_enqueue_style( 'parent-css', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'child-css', get_stylesheet_directory_uri() . '/stlye.css' );
}

add_action( 'wp_enqueue_scripts', 'theme_styles' );
```

## Theme Information

## Stylesheets
_[Codex](https://developer.wordpress.org/themes/basics/main-stylesheet-style-css/)_

Theme information comes from the style.css file. 
A demo structure can be found on the WordPress Codex page, some information is opional.

Template Stylesheet
```css
/*
Theme Name: Twenty Seventeen
Theme URI: https://wordpress.org/themes/twentyseventeen/
Author: the WordPress team
Author URI: https://wordpress.org/
Description: Twenty Seventeen brings your site to life with immersive featured images and subtle animations. With a focus on business sites, it features multiple sections on the front page as well as widgets, navigation and social menus, a logo, and more. Personalize its asymmetrical grid with a custom color scheme and showcase your multimedia content with post formats. Our default theme for 2017 works great in many languages, for any abilities, and on any device.
Version: 1.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: twentyseventeen
Tags: one-column, two-columns, right-sidebar, flexible-header, accessibility-ready, custom-colors, custom-header, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, post-formats, rtl-language-support, sticky-post, theme-options, threaded-comments, translation-ready
This theme, like WordPress, is licensed under the GPL.
Use it to make something cool, have fun, and share what you've learned with others.
*/
```

Once a stylesheet has been created although the theme information will appear in WordPress the stylesheet still needs to be linked via the functions.php for it to take effect.

This can be achieved using an action hook

```php
// Load in our Stylesheet
function themename_enqueue_styles(){
	// No Deps (empty array) and Dev Time Versioning Trick
	wp_enqueue_style( 'main-css', get_stylesheet_directory_uri() . '/style.css', [], time() );
}

add_action( 'wp_enqueue_scripts', 'themename_enqueue_styles' );
```

### Adding Google Fonts via Enqueue

Including a google font via the enqueue style is easy, simply add another entry with no dependencies and null version.

```php
wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css?family=Merriweather+Sans|Roboto', array(), null );
```


## Theme Support
_[Codex](https://developer.wordpress.org/reference/functions/add_theme_support/)_

Theme support is added via the functions.php file, here you declare what features are supported within your theme.


## Templates
A template is a PHP file that determines how content is displayed for example how a blog post is displayed over how an archive page is displayed.


## Template Hierarchy
_[Codex](https://developer.wordpress.org/themes/basics/template-hierarchy/)_

The template hierarchy is a collection of templates, the hierarchy shows their relationship between one another.

![WordPress Template Hierarchy](https://developer.wordpress.org/files/2014/10/wp-hierarchy-768x404.png "WordPress Template Hierarchy")

_[Interactive Hierarchy](https://wphierarchy.com/)_

## Fallback Architecture

Fallback architecture means that if a certain template is unavailable WordPress will look through backup templates to load instead.

For example, if **page.php** is unavailable WordPress will fallback to **singular.php** and if that is unavailable then WordPress will fallback to **index.php**

## Register Menus
_[Codex](https://codex.wordpress.org/Function_Reference/register_nav_menus)_

Registering a menu creates a location (not the menu itself) for users to add custom menus for use in a theme.

The "menu_location" is the ID which we call in our templates and the "Menu Description" appears in the users webpanel.
```php
register_nav_menus( array(
	'menu_location' => esc_html__( 'Menu Description', 'textdomain' )
) );
```

_**Note:** `esc_html__( 'text','textdomain' )` will return an escaped text translation `esc_html_e( 'text','textdomain' )` will echo the escaped text translation._

After the menu locations have been created you can then add the menu in the template file using wp_nav_menu().

_[Codex](https://developer.wordpress.org/reference/functions/wp_nav_menu/)_

Full list of arguments
```php
<?php $defaults = array(
    'theme_location'  => ,
    'menu'            => ,
    'container'       => 'div',
    'container_class' => 'menu-{menu slug}-container',
    'container_id'    => ,
    'menu_class'      => 'menu',
    'menu_id'         => ,
    'echo'            => true,
    'fallback_cb'     => 'wp_page_menu',
    'before'          => ,
    'after'           => ,
    'link_before'     => ,
    'link_after'      => ,
    'items_wrap'      => '<ul id=\"%1$s\" class=\"%2$s\">%3$s</ul>',
    'depth'           => 0,
    'walker'          =>
);
?>
 
<?php wp_nav_menu( $defaults ); ?>
```

## Register Sidebar
_[Codex](https://codex.wordpress.org/Function_Reference/register_sidebar)_

Active Sidebar
Dynamic Sidebar



## Simple Project
After learning the fundamentals, I wanted to set myself a task of creating a simple blog website using WordPress with a custom theme, I will be calling it 'Craft at Home' and will look something like the wireframe below.

![Project Wireframe Concept](/assets/images/posts/learning_wordpress_wireframe.png)

---
[Back to Top](#contents)






