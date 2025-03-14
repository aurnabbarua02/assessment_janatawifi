from rest_framework import serializers
from . models import *

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMarketModel
        fields = ['id', 'date', 'trade_code','high','low','open','close','volume']
