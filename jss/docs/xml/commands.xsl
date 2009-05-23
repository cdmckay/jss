<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">	
	<ul>
		<xsl:for-each select="commands/command">
			<li>
				<!-- Name -->      
				<strong><xsl:value-of select="name" /><xsl:text> </xsl:text></strong>	  
				
				<!-- Selector -->
				<xsl:if test="selector">
					<xsl:text>[(</xsl:text>selector<xsl:text>)] </xsl:text>
				</xsl:if>
				
				<!-- Parameters -->
				<xsl:for-each select="param">
					<xsl:choose>
					  	<xsl:when test="@optional = 'true'">
					        <xsl:text>[</xsl:text><xsl:value-of select="." /><xsl:text>]</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="." />
						</xsl:otherwise>
					</xsl:choose>
					<xsl:if test="@variable = 'true'">
						<xsl:text>, ...</xsl:text>
					</xsl:if>							
					<xsl:if test="position() != last()">			
						<xsl:text>, </xsl:text>
					</xsl:if>											
				</xsl:for-each>      
			  
				<!-- Summary -->
				<p><xsl:value-of select="summary" /></p>
				
				<!-- Example -->
				<pre lang="javascript"><xsl:value-of select="example" /></pre>
			</li>
		</xsl:for-each>
	</ul>
</xsl:template>

</xsl:stylesheet>